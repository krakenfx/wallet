import { groupBy, uniqWith } from 'lodash';

import { AddressAnalysisWarning, AnalyseAddressResult } from '@/api/types';

const collapseWarningsToMessage = (warnings: AddressAnalysisWarning[]) => warnings.map(w => w.message).join('\n');

const getWarning = (group: Record<AddressAnalysisWarning['severity'], AddressAnalysisWarning[] | undefined>): AddressAnalysisWarning | undefined => {
  if (group.CRITICAL?.length) {
    return {
      severity: 'CRITICAL',
      message: collapseWarningsToMessage(group.CRITICAL),
    };
  }
  if (group.WARNING?.length) {
    return {
      severity: 'WARNING',
      message: collapseWarningsToMessage(group.WARNING),
    };
  }
  if (group.INFO?.length) {
    return {
      severity: 'INFO',
      message: collapseWarningsToMessage(group.INFO),
    };
  }
  return undefined;
};

export type NetworkFilter = {
  caipId: string;
  filterWarnings: boolean;
  filterSendCount: boolean;
};

const getFilteredDataSet = (data: AnalyseAddressResult[], networkFilter?: NetworkFilter) => {
  if (!networkFilter) {
    return {
      sendCount: data,
      warnings: data,
    };
  }
  const filteredData = data.filter(({ network }) => network === networkFilter.caipId);

  return {
    sendCount: networkFilter.filterSendCount ? filteredData : data,
    warnings: networkFilter.filterWarnings ? filteredData : data,
  };
};

export const parseAddressAnalysis = (data: AnalyseAddressResult[], networkFilter?: NetworkFilter) => {
  if (!data.length) {
    return;
  }
  const filteredData = getFilteredDataSet(data, networkFilter);
  const prevSendCount = filteredData.sendCount.reduce((total, networkData) => (networkData.info.prevSendCount ?? 0) + total, 0);
  const allWarnings = uniqWith(
    filteredData.warnings.flatMap(networkData => networkData.warnings),
    (a, b) => a.severity === b.severity && a.message === b.message,
  );
  const groupedBySeverity = groupBy(allWarnings, 'severity') as Record<AddressAnalysisWarning['severity'], AddressAnalysisWarning[]>;

  const warning = getWarning(groupedBySeverity);
  return {
    warning,
    prevSendCount,
  };
};
