import React, { useRef, useState } from 'react';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Badge,
	Box,
	Button,
	ButtonGroup,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Icon,
	IconButton,
	Stack,
	Text,
	Tooltip,
	useBreakpointValue,
	useToast,
} from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import { useMutation, useQueryClient } from 'react-query';
import API from '../../../../../../assets/js/back-end/utils/api';
import { urls } from '../../constants/urls';
import { GroupSchema } from '../../types/group';
import Name from '../../common/components/Name';
import EmailsInput from '../../common/components/EmailsInput';
import { deepClean } from '../../../../../../assets/js/back-end/utils/utils';
import { groupsBackendRoutes } from '../../routes/routes';
import { useNavigate } from 'react-router-dom';
import { BiBook, BiEdit, BiGroup, BiTrash } from 'react-icons/bi';
import Editor from '../../../../../../assets/js/back-end/components/common/Editor';
import { GroupStatus } from '../../enums/Enum';
// import { GroupStatus } from '../../enums/Enum';

interface GroupProps {
	group: GroupSchema;
	onExpandedGroupsChange?: (id: number | null) => void;
	isGroupExpanded?: boolean;
}

const Group: React.FC<GroupProps> = ({
	group,
	onExpandedGroupsChange,
	isGroupExpanded,
}) => {
	const toast = useToast();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const groupAPI = new API(urls.groups);
	const methods = useForm<GroupSchema>();
	const [isOpen, setIsOpen] = useState(false);
	const onClose = () => setIsOpen(false);
	const onOpen = () => setIsOpen(true);
	const cancelRef = useRef<HTMLButtonElement>(null);

	const handleDeleteClick = () => {
		onOpen();
	};

	const updateGroup = useMutation<GroupSchema>(
		(data) => groupAPI.update(group.id, data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(`group${group.id}`);
				queryClient.invalidateQueries(`groupsList`);
				toast({
					title: __(
						'Group updated successfully.',
						'learning-management-system',
					),
					isClosable: true,
					status: 'success',
				});
				navigate(groupsBackendRoutes.list);
			},

			onError: (error: any) => {
				const message: any = error?.message
					? error?.message
					: error?.data?.message;

				toast({
					title: __(
						'Failed to update the group.',
						'learning-management-system',
					),
					description: message ? `${message}` : undefined,
					status: 'error',
					isClosable: true,
				});
			},
		},
	);

	const deleteGroup = useMutation(
		() => groupAPI.delete(group.id, { force: true }),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['groupsList']);
				toast({
					title: __(
						'Group created successfully.',
						'learning-management-system',
					),
					status: 'success',
					isClosable: true,
				});
				onExpandedGroupsChange?.(null);
			},
			onError: (error: any) => {
				toast({
					title: __('An error occurred.', 'learning-management-system'),
					description: error.response?.data?.message || error.message,
					status: 'error',
					isClosable: true,
				});
			},
		},
	);

	const onSubmit = (data: GroupSchema) => {
		updateGroup.mutate(deepClean(data));
	};

	const isPublished = group.status === GroupStatus.Publish;
	const buttonSize = useBreakpointValue(['sm', 'md']);

	return (
		<>
			<AlertDialog
				isOpen={isOpen}
				onClose={onClose}
				leastDestructiveRef={cancelRef}
				isCentered
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							{__('Deleting Group', 'learning-management-system')}
						</AlertDialogHeader>
						<AlertDialogBody>
							{__(
								'Are you sure? You can’t undo this action afterwards.',
								'learning-management-system',
							)}
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose}>
								{__('Cancel', 'learning-management-system')}
							</Button>
							<Button
								colorScheme="red"
								onClick={() => deleteGroup.mutate()}
								ml={3}
								isLoading={deleteGroup.isLoading}
							>
								{__('Delete', 'learning-management-system')}
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
			<Box
				bgColor="white"
				my={3}
				border="1px"
				borderColor="gray.200"
				boxShadow={isGroupExpanded ? 'lg' : 'none'}
			>
				<Flex justifyContent={'space-between'} alignItems={'center'} p={3}>
					<Text
						fontWeight="bold"
						cursor="pointer"
						onClick={() => onExpandedGroupsChange?.(group.id)}
					>
						{group.title}
						{!isPublished && (
							<Badge ml={3} colorScheme="yellow" p={1} borderRadius="md">
								{__('Pending', 'learning-management-system')}
							</Badge>
						)}
					</Text>
					<ButtonGroup color="gray.500" size="xs" p="2">
						<Tooltip
							label={`${group?.emails?.length || 0} ${__(
								'members',
								'learning-management-system',
							)}`}
						>
							<HStack spacing="1">
								<Icon as={BiGroup} />
								<Text textAlign="start" fontSize="md">
									{group?.emails?.length || 0}
								</Text>
							</HStack>
						</Tooltip>
						<Tooltip
							label={`${group?.courses_count || 0} ${__(
								'Enrolled Courses',
								'learning-management-system',
							)}`}
						>
							<HStack spacing="1">
								<Icon as={BiBook} />
								<Text textAlign="start" fontSize="md">
									{group?.courses_count || 0}
								</Text>
							</HStack>
						</Tooltip>
						<Tooltip label={__('Edit', 'learning-management-system')}>
							<IconButton
								_hover={{ color: 'primary.500', background: 'none' }}
								onClick={() => onExpandedGroupsChange?.(group.id)}
								variant="unstyled"
								cursor={'pointer'}
								icon={<Icon fontSize="xl" as={BiEdit} />}
								aria-label={__('Edit', 'learning-management-system')}
							/>
						</Tooltip>
						<Tooltip label={__('Delete', 'learning-management-system')}>
							<IconButton
								_hover={{ color: 'red.500', background: 'none' }}
								cursor={'pointer'}
								isDisabled={deleteGroup.isLoading}
								isLoading={deleteGroup.isLoading}
								onClick={handleDeleteClick}
								variant="unstyled"
								icon={<Icon fontSize="xl" as={BiTrash} />}
								aria-label={__('Delete', 'learning-management-system')}
							/>
						</Tooltip>
					</ButtonGroup>
				</Flex>
				{isGroupExpanded && <Divider />}

				{isGroupExpanded && (
					<Box p={4}>
						<FormProvider {...methods}>
							<form onSubmit={methods.handleSubmit(onSubmit)}>
								<Stack direction="column" spacing="6">
									<Name defaultValue={group?.title || ''} />
									<FormControl>
										<FormLabel>
											{__('Group Description', 'learning-management-system')}
										</FormLabel>
										<Editor
											id="mto-group-description"
											name="description"
											defaultValue={group?.description || ''}
											height={200}
										/>
									</FormControl>
									<EmailsInput defaultValue={group?.emails || []} />
									<ButtonGroup>
										<Button
											type="submit"
											size={buttonSize}
											colorScheme="primary"
											isLoading={updateGroup.isLoading}
										>
											{__('Update', 'learning-management-system')}
										</Button>
										<Button
											size={buttonSize}
											variant="outline"
											onClick={() => onExpandedGroupsChange?.(group.id)}
										>
											{__('Cancel', 'learning-management-system')}
										</Button>
									</ButtonGroup>
								</Stack>
							</form>
						</FormProvider>
					</Box>
				)}
			</Box>
		</>
	);
};

export default Group;
