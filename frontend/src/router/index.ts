import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// Import components
import Home from "@presentation/pages/Home.vue";
import Dashboard from "@presentation/pages/Dashboard.vue";
import Profile from "@presentation/pages/Profile.vue";
import QuestDetail from "@presentation/pages/QuestDetail.vue";
import UserList from "@presentation/users/UserList.vue";
import QuestList from "@presentation/quests/QuestList.vue";

/**
 * Vue Router configuration
 * Defines application routes and navigation
 */
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home - TermQuestGenesis",
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      title: "Dashboard - TermQuestGenesis",
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      title: "Profile - TermQuestGenesis",
    },
  },
  {
    path: "/users",
    name: "Users",
    component: UserList,
    meta: {
      title: "Users - TermQuestGenesis",
    },
  },
  {
    path: "/quests",
    name: "Quests",
    component: QuestList,
    meta: {
      title: "Quests - TermQuestGenesis",
    },
  },
  {
    path: "/quests/:id",
    name: "QuestDetail",
    component: QuestDetail,
    meta: {
      title: "Quest Details - TermQuestGenesis",
    },
  },
  // Catch-all route for 404s
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@presentation/pages/NotFound.vue"),
    meta: {
      title: "Page Not Found - TermQuestGenesis",
    },
  },
];

/**
 * Create and configure the Vue Router instance
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Return to saved position if available (browser back/forward)
    if (savedPosition) {
      return savedPosition;
    }
    // Scroll to top for new routes
    return { top: 0 };
  },
});

/**
 * Global navigation guard to update page titles
 */
router.beforeEach((to, from, next) => {
  // Update document title based on route meta
  if (to.meta?.title) {
    document.title = to.meta.title as string;
  } else {
    document.title = "TermQuestGenesis";
  }

  next();
});

export default router;
