import {
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useMemo } from 'react';
import {
	tabListStyles,
	tabStyles,
} from '../../../../assets/js/back-end/config/styles';
import {
	SettingsMap,
	SettingsSearchResults,
} from '../../../../assets/js/back-end/types';
import { isArray } from '../../../../assets/js/back-end/utils/utils';
import AchievementsTabContent from './AchievementsTabContent';
import PointsTabContent from './PointsTabContent';
import RanksTabContent from './RanksTabContent';
import { updateSecondaryTab } from '../../../../assets/js/back-end/screens/settings/components/SearchedResults/sectionsInfo';

interface Props {
	data?: SettingsMap['gamipress'];
	activeTab?: number;
	onSelectedTabsInfoChange: (value: any) => void;
	currentlyActivePrimaryTabIndex: number;
	selectedTabsInfo: SettingsSearchResults;
	activeAddons: string[];
}

const GamiPressSettings: React.FC<Props> = (props) => {
	const {
		data,
		currentlyActivePrimaryTabIndex,
		onSelectedTabsInfoChange,
		selectedTabsInfo,
		activeTab,
		activeAddons,
	} = props;

	const pointTypeUiPlacements = useMemo(() => {
		if (data?.ui_placements && isArray(data?.ui_placements)) {
			return data.ui_placements.filter(
				(placement) => placement.reward_type === 'point',
			);
		}
		return [];
	}, [data?.ui_placements]);

	const achievementTypeUiPlacements = useMemo(() => {
		if (data?.ui_placements && isArray(data?.ui_placements)) {
			return data.ui_placements.filter(
				(placement) => placement.reward_type === 'achievement',
			);
		}
		return [];
	}, [data?.ui_placements]);

	const rankTypeUiPlacements = useMemo(() => {
		if (data?.ui_placements && isArray(data?.ui_placements)) {
			return data.ui_placements.filter(
				(placement) => placement.reward_type === 'rank',
			);
		}
		return [];
	}, [data?.ui_placements]);

	return (
		<Tabs
			orientation="vertical"
			index={activeTab}
			onChange={(index) => {
				onSelectedTabsInfoChange(
					updateSecondaryTab(
						selectedTabsInfo,
						currentlyActivePrimaryTabIndex,
						index,
						activeAddons,
					),
				);
			}}
		>
			<Stack direction="row" flex="1">
				<TabList sx={tabListStyles}>
					<Tab sx={tabStyles}>{__('Points', 'learning-management-system')}</Tab>
					<Tab sx={tabStyles}>
						{__('Achievements', 'learning-management-system')}
					</Tab>
					<Tab sx={tabStyles}>{__('Ranks', 'learning-management-system')}</Tab>
				</TabList>
				<TabPanels flex="1">
					<TabPanel>
						<PointsTabContent ui_placements={pointTypeUiPlacements} />
					</TabPanel>

					<TabPanel>
						<AchievementsTabContent
							ui_placements={achievementTypeUiPlacements}
						/>
					</TabPanel>

					<TabPanel>
						<RanksTabContent ui_placements={rankTypeUiPlacements} />
					</TabPanel>
				</TabPanels>
			</Stack>
		</Tabs>
	);
};

export default GamiPressSettings;
