import { AxiosError, isAxiosError } from "axios";

export const handleError = (error: unknown) => {
	if (isAxiosError(error)) {
		const axiosError = error as AxiosError;
		if (typeof axiosError.response?.data === "string") {
			return axiosError.response?.data;
		}
		return axiosError;
	}
	return error;
};
