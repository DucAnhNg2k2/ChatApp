import Conversation from "../Pages/Chat";
import Login from "../Pages/login";

export interface route {
  path: string;
  component: React.FunctionComponent<{}>;
}
export const RouterName = {
  LOGIN: "/",
  CONVERSATION: "/conversation",
};

const ListRoute: Array<route> = [
  {
    path: RouterName.LOGIN,
    component: Login,
  },
  {
    path: RouterName.CONVERSATION,
    component: Conversation,
  },
];

export default ListRoute;
