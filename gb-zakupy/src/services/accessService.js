import { COMPANY_ACCESS_CODE } from "../config/accessConfig";


export function checkAccessCode(inputCode) {

  if (!inputCode) {
    return false;
  }


  return (
    inputCode.trim().toUpperCase() ===
    COMPANY_ACCESS_CODE.toUpperCase()
  );

}
