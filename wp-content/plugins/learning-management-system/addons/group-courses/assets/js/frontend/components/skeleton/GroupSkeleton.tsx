import React from 'react';
import {
	Box,
	Flex,
	ButtonGroup,
	SkeletonCircle,
	SkeletonText,
} from '@chakra-ui/react';

const GroupsSkeleton: React.FC = () => {
	const skeletonRows = 5;

	return (
		<>
			{[...Array(skeletonRows)].map((_, index) => (
				<Box
					key={index}
					bgColor="white"
					my={3}
					border="1px"
					borderColor="gray.200"
					boxShadow={'lg'}
				>
					<Flex justifyContent={'space-between'} alignItems={'center'} p={3}>
						<SkeletonText width="90px" noOfLines={1} />
						<ButtonGroup isAttached size="sm">
							<SkeletonCircle size="8" />
							<SkeletonCircle size="8" />
							<SkeletonCircle size="8" />
						</ButtonGroup>
					</Flex>
				</Box>
			))}
		</>
	);
};

export default GroupsSkeleton;
