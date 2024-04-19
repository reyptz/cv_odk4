import React, { useEffect, useState } from 'react';
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Wrap,
	WrapItem,
	Tag,
	TagLabel,
	TagCloseButton,
	InputGroup,
	InputRightElement,
	IconButton,
	Box,
	Stack,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import { MdOutlineKeyboardReturn } from 'react-icons/md';
import localized from '../../../../../../assets/js/account/utils/global';

interface Props {
	defaultValue?: string[];
}

const EmailsInput: React.FC<Props> = ({ defaultValue = [] }) => {
	const {
		setValue,
		watch,
		trigger,
		formState: { errors },
		setError,
		clearErrors,
	} = useFormContext();
	const [input, setInput] = useState('');
	const emails = watch('emails') || defaultValue;
	const groupLimit = localized?.group_courses?.group_limit || 0;

	const isValidEmail = (email: string) => {
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email.toLowerCase());
	};

	const handleAddEmail = () => {
		if (!isValidEmail(input)) {
			setError('emails', {
				type: 'manual',
				message: __('Invalid email address.', 'learning-management-system'),
			});
			return;
		}

		if (emails.includes(input)) {
			setError('emails', {
				type: 'manual',
				message: __('Email already added.', 'learning-management-system'),
			});
			return;
		}

		if (groupLimit > 0 && emails.length >= groupLimit) {
			setError('emails', {
				type: 'manual',
				message: __('Group limit reached.', 'learning-management-system'),
			});
			return;
		}

		const updatedEmails = [...emails, input];
		setValue('emails', updatedEmails, { shouldValidate: true });
		setInput('');
		clearErrors('emails');
		trigger('emails');
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);

		if (e.target.value.length === 0 || isValidEmail(e.target.value)) {
			clearErrors(['emails']);
		}
	};

	const handleRemoveEmail = (emailToRemove: string) => {
		const updatedEmails = emails.filter(
			(email: string) => email !== emailToRemove,
		);

		setValue('emails', updatedEmails, { shouldValidate: true });
		trigger('emails');
	};

	return (
		<FormControl isInvalid={Boolean(errors.emails)}>
			<FormLabel>
				{`${__('Members', 'learning-management-system')}${
					groupLimit > 0
						? ` ( ${__('Group limit:', 'learning-management-system')} ${
								emails.length
							}/${groupLimit})`
						: ''
				}`}
			</FormLabel>
			<Stack spacing={2} direction="row" flexWrap="wrap">
				<InputGroup>
					<Input
						value={input}
						placeholder={__('Add new member', 'learning-management-system')}
						onChange={handleInputChange}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								handleAddEmail();
							}
						}}
					/>
					<InputRightElement>
						<IconButton
							aria-label={__('Add Email', 'learning-management-system')}
							icon={<MdOutlineKeyboardReturn size="24px" color="white" />}
							onClick={handleAddEmail}
							isDisabled={
								!isValidEmail(input) ||
								emails.includes(input) ||
								(groupLimit > 0 && emails.length >= groupLimit)
							}
							variant="solid"
							colorScheme="primary"
						/>
					</InputRightElement>
				</InputGroup>
				{errors.emails && (
					<FormErrorMessage>
						{errors.emails.message?.toString()}
					</FormErrorMessage>
				)}
				<Box display={'flex'} justifyContent={'flex-start'} flexWrap={'wrap'}>
					{emails &&
						emails.map((email: string, index: number) => (
							<WrapItem key={index}>
								<Tag colorScheme="blue" mx={1} mt={2}>
									<TagLabel>{email}</TagLabel>
									<TagCloseButton
										color={'white'}
										onClick={() => handleRemoveEmail(email)}
									/>
								</Tag>
							</WrapItem>
						))}
				</Box>
			</Stack>
		</FormControl>
	);
};

export default EmailsInput;
