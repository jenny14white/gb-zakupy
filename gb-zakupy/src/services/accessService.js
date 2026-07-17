import { COMPANY_ACCESS_CODE } from "../utils/accessCode";


export function checkAccessCode(code) {

  if (!code) {
    return false;
  }


  const normalizedCode =
    code
      .trim()
      .toUpperCase();



  return (
    normalizedCode ===
    COMPANY_ACCESS_CODE.toUpperCase()
  );

}
