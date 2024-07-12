import Conversation from "../Pages/Chat";
import Login from "../Pages/login";

export interface route {
  path: string;
  component: React.FunctionComponent<{}>;
}
const ListRoute: Array<route> = [
  {
    path: "",
    component: Login,
  },
  {
    path: "/conversation",
    component: Conversation,
  },
];

export default ListRoute;
