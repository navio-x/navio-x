import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/home.vue";
import Wallets from "../views/wallets.vue";
import Send from "../views/send.vue";
import Receive from "../views/receive.vue";
import Help from "../views/help.vue";
import Console from "../views/console.vue";
import Settings from "../views/settings.vue";
import History from "../views/history.vue";
import Staking from "../views/staking.vue";

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/wallets",
    name: "Wallets",
    component: Wallets,
  },
  {
    path: "/send",
    name: "Send",
    component: Send,
  },
  {
    path: "/receive",
    name: "Receive",
    component: Receive,
  },
  {
    path: "/history",
    name: "History",
    component: History,
  },
  {
    path: "/staking",
    name: "Staking",
    component: Staking,
  },
  {
    path: "/help",
    name: "Help",
    component: Help,
  },
  {
    path: "/console",
    name: "Console",
    component: Console,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "bg-slate-700"
});

export default router;
