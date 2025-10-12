import { redirect } from "next/navigation";
import { FunctionComponent } from "react";

import { ROUTES } from "../routes";

interface AccountProps {}

const Account: FunctionComponent<AccountProps> = () => {
  redirect(ROUTES.ACCOUNT.PROFILE);
};

export default Account;
