export interface ApplicationJobPosting {
	title: string;
	content: string;
	deadline: string;
	companyName: string;
}

export interface StatusHistory {
	toStatusId : string;
	toStatusName: string;
	changedAt: string;
}

export interface ApplicationStatusOption {
	id: string;
	name: string;
}

export interface ApplicationRecord {
	id: string;
	userId: string;
	jobPostingId: string;
	appliedAt: string;
	notes: string;
	createdAt: string;
	updatedAt: string;
	statusId: string;
	statusName: string;
	jobPostings: ApplicationJobPosting;
	histories?: StatusHistory[];
}

export interface ApplicationsResponse {
	applications?: ApplicationRecord[];
	items?: ApplicationRecord[];
}

export interface ApplicationDetailResponse {
	application?: ApplicationRecord;
	item?: ApplicationRecord;
	data?: ApplicationRecord;
}
