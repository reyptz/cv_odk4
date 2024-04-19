import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
	Box,
	Button,
	ButtonGroup,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Stack,
	Text,
	useBreakpointValue,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import Name from '../../common/components/Name';
import EmailsInput from '../../common/components/EmailsInput';
import Editor from '../../../../../../assets/js/back-end/components/common/Editor';
import { GroupSchema } from '../../types/group';

interface AddGroupFormProps {
	handleAddNewGroup: (data: GroupSchema) => void;
	isLoading: boolean;
	onClose: () => void;
}

const AddGroupForm: React.FC<AddGroupFormProps> = ({
	handleAddNewGroup,
	isLoading,
	onClose,
}) => {
	const methods = useForm<GroupSchema>();
	const buttonSize = useBreakpointValue(['sm', 'md']);

	const onSubmit = (data: any) => {
		handleAddNewGroup(data);
	};

	return (
		<Box
			bgColor="white"
			my={3}
			border="1px"
			borderColor="gray.200"
			boxShadow={'lg'}
		>
			<Flex
				cursor={'pointer'}
				justifyContent={'space-between'}
				alignItems={'center'}
				p={3}
			>
				<Text fontWeight="bold">
					{__('Add New Group', 'learning-management-system')}
				</Text>
			</Flex>
			<Divider />
			<Box p={4}>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<Stack direction="column" spacing="6">
							<Name />
							<FormControl>
								<FormLabel>
									{__('Group Description', 'learning-management-system')}
								</FormLabel>
								<Editor
									id="mto-group-description"
									name="description"
									height={200}
								/>
							</FormControl>
							<EmailsInput />
							<ButtonGroup>
								<Button
									type="submit"
									size={buttonSize}
									colorScheme="primary"
									isLoading={isLoading}
								>
									{__('Create', 'learning-management-system')}
								</Button>
								<Button
									size={buttonSize}
									variant="outline"
									onClick={() => onClose()}
								>
									{__('Cancel', 'learning-management-system')}
								</Button>
							</ButtonGroup>
						</Stack>
					</form>
				</FormProvider>
			</Box>
		</Box>
	);
};

export default AddGroupForm;
