export interface Customer {
  id : number;
  name : string;
  email : string;
}

export interface CustomerPagination{
  currentPage: number;
  totalPages: number;
  pageSize: number;
  customerDTOS:Customer[]
}
