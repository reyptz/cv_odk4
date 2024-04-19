import {
	Box,
	FormControl,
	FormLabel,
	Icon,
	InputGroup,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Stack,
	Tooltip,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BiInfoCircle } from 'react-icons/bi';
import { infoIconStyles } from '../../../../../../../assets/js/back-end/config/styles';

interface Props {
	name: `${string}` | `${string}.${string}` | `${string}.${number}`;
	defaultValue?: number | string;
	label: string;
	required: boolean | string;
}
const NumberField: React.FC<Props> = (props) => {
	const { name, defaultValue, label, required } = props;
	const [number, setNumber] = useState<string>(String(defaultValue) ?? '0');
	const {
		setValue,
		formState: { errors },
	} = useFormContext();

	useEffect(() => {
		setValue(name, number);
	}, [number, name, setValue]);

	return (
		<FormControl isInvalid={!!errors?.[name]}>
			<FormLabel>
				{label}
				<Tooltip
					label={__('0 refers to infinite', 'learning-management-system')}
					hasArrow
					fontSize="xs"
				>
					<Box as="span" sx={infoIconStyles}>
						<Icon as={BiInfoCircle} />
					</Box>
				</Tooltip>
			</FormLabel>
			<Stack direction="column" spacing="1">
				<Controller
					name={name}
					defaultValue={defaultValue}
					rules={{
						required: required,
						min: {
							value: 0,
							message: __(
								'Number should be more than or equal to 0',
								'learning-management-system',
							),
						},
					}}
					render={({ field }) => (
						<InputGroup display="flex" flexDirection="row">
							<NumberInput w="100%" {...field} min={0}>
								<NumberInputField rounded="sm" type="number" />
								<NumberInputStepper>
									<NumberIncrementStepper
										onChange={() => setNumber(String(+number + 1))}
									/>
									<NumberDecrementStepper
										onChange={() => setNumber(String(+number - 1))}
									/>
								</NumberInputStepper>
							</NumberInput>
						</InputGroup>
					)}
				/>
			</Stack>
		</FormControl>
	);
};

export default NumberField;
