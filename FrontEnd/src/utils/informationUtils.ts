import { 
  SUBMISSION_TYPES, 
  INFORMATION_TYPES, 
  type SubmissionType,
  type InformationType,
} from '../constants/informationConstants';

export const getSubmissionTypeLabel = (value: SubmissionType | number): string => {
  const item = SUBMISSION_TYPES.find(type => type.value === value);
  return item?.label || "Other";
};

export const getInformationTypeLabel = (value: InformationType | number): string => {
  const item = INFORMATION_TYPES.find(type => type.value === value);
  return item?.label || "Unknown";
};

export const getInformationTypeMessage = (value: InformationType | number): string => {
  const item = INFORMATION_TYPES.find(type => type.value === value);
  return item?.message || "Status unknown.";
};

// 複合的な関数も定義可能
export const getInformationDisplayData = (information: {
  submission_type: SubmissionType | number
  information_type: InformationType | number,
}) => {
  return {
    typeLabel: getInformationTypeLabel(information.information_type),
    submissionTypeLabel: getSubmissionTypeLabel(information.submission_type),
    message: getInformationTypeMessage(information.information_type),
    isSubmitted: information.information_type === 1,
    isApproved: information.information_type === 2,
    isRejected: information.information_type === 3,
    isAttendanceType: information.submission_type === 0,
    isExpenseType: information.submission_type === 1,
    submissionType: information.submission_type,
    informationType: information.information_type,
  };
};

// 特定の値をチェックするヘルパー関数
export const isSubmitted = (status: number): boolean => status === 1;
export const isApproved = (status: number): boolean => status === 2;
export const isRejected = (status: number): boolean => status === 3;

export const isAttendanceType = (type: number): boolean => type === 0;
export const isExpenseType = (type: number): boolean => type === 1;
