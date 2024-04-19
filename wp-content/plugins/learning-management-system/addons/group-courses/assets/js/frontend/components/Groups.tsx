import React, { useState } from 'react';
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Heading,
	Text,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import { IoAddOutline } from 'react-icons/io5';
import Group from './Group';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import API from '../../../../../../assets/js/back-end/utils/api';
import { urls } from '../../constants/urls';
import MasteriyoPagination from '../../../../../../assets/js/back-end/components/common/MasteriyoPagination';
import { GroupSchema } from '../../types/group';
import AddGroupForm from './AddGroupForm';
import {
	deepClean,
	isEmpty,
} from '../../../../../../assets/js/back-end/utils/utils';
import GroupSkeleton from './skeleton/GroupSkeleton';

interface FilterParams {
	per_page?: number;
	page?: number;
	orderby: string;
	order: 'asc' | 'desc';
}

const groupAPI = new API(urls.groups);

const Groups: React.FC = () => {
	const queryClient = useQueryClient();
	const { isOpen, onToggle, onClose } = useDisclosure();
	const toast = useToast();
	const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);
	const [filterParams, setFilterParams] = React.useState<FilterParams>({
		order: 'desc',
		orderby: 'date',
	});

	const groupQuery = useQuery(
		['groupsList', filterParams],
		() => groupAPI.list(filterParams),
		{
			keepPreviousData: true,
		},
	);
	const addGroupMutation = useMutation<GroupSchema>((data) =>
		groupAPI.store(data),
	);

	const handleAddNewGroup = (data: GroupSchema) => {
		addGroupMutation.mutate(deepClean(data), {
			onSuccess: (data) => {
				onToggle();
				toast({
					title:
						data.title + __(' has been added.', 'learning-management-system'),
					status: 'success',
					isClosable: true,
				});
				queryClient.invalidateQueries(`groupsList`);
			},

			onError: (error: any) => {
				const message: any = error?.message
					? error?.message
					: error?.data?.message;

				toast({
					title: __('Failed to create group.', 'learning-management-system'),
					description: message ? `${message}` : undefined,
					status: 'error',
					isClosable: true,
				});
			},
		});
	};

	return (
		<>
			<Box display="flex" justifyContent="space-between">
				<Heading as="h4" size="md" fontWeight="bold" color="primary.900">
					{__('Groups', 'learning-management-system')}
				</Heading>
				<Button
					colorScheme="primary"
					leftIcon={<IoAddOutline size={20} />}
					onClick={() => {
						setExpandedGroupId(null);
						onToggle();
					}}
				>
					{__('Add New Group', 'learning-management-system')}
				</Button>
			</Box>
			{isOpen && (
				<AddGroupForm
					handleAddNewGroup={handleAddNewGroup}
					isLoading={addGroupMutation.isLoading}
					onClose={onClose}
				/>
			)}
			{groupQuery.isLoading || !groupQuery.isFetched ? (
				<GroupSkeleton />
			) : groupQuery.isError ? (
				<Alert status="error">
					<AlertIcon />
					{__('Error fetching groups.', 'learning-management-system')}
				</Alert>
			) : groupQuery.isSuccess && isEmpty(groupQuery?.data?.data) && !isOpen ? (
				<Alert status="info">
					<AlertIcon />
					{__('No groups found.', 'learning-management-system')}
				</Alert>
			) : (
				groupQuery?.data?.data?.map((group: GroupSchema) => (
					<Group
						key={group.id}
						group={group}
						isGroupExpanded={expandedGroupId === group.id}
						onExpandedGroupsChange={(id) =>
							setExpandedGroupId((prevId) => (prevId === id ? null : id))
						}
					/>
				))
			)}
			{groupQuery.isSuccess && !isEmpty(groupQuery?.data?.data) && (
				<MasteriyoPagination
					metaData={groupQuery?.data?.meta}
					setFilterParams={setFilterParams}
					perPageText={__('Groups Per Page:', 'learning-management-system')}
				/>
			)}
		</>
	);
};

export default Groups;
