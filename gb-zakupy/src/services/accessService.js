import { COMPANY_ACCESS_CODE } from "../utils/accessCode";


export function checkAccessCode(code) {

  if (!code) {
    return false;
  }


  return (
    code.trim().toUpperCase() ===
    COMPANY_ACCESS_CODE.toUpperCase()
  );

}
