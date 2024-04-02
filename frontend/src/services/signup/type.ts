type IFetchCreateMemberRequest = {
  formData: FormData; // birth, gender, nickname
};

interface IFetchUpdateMemberRequest {
  formData: FormData; // birth, gender, nickname, profile
}

export type { IFetchCreateMemberRequest, IFetchUpdateMemberRequest };
