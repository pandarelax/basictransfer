export interface IDepartmentResponse {
    data: IDepartment[];
    success: boolean;
    message: string;
}

export interface IDepartment {
    id: string;
    name: string;
}

export interface IGetDepartment {
    data: IDepartment;
    success: boolean;
    message: string;
}