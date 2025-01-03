import { A } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import styles from "./Sidebar.module.scss";
import { config } from "../store";
import { FiEdit2 } from "solid-icons/fi";
import SettingsBackupRestore from "@suid/icons-material/SettingsBackupRestore";
import DownloadRounded from "@suid/icons-material/DownloadRounded";
import FastRewindSharp from "@suid/icons-material/FastRewindSharp";
import Brush from "@suid/icons-material/Brush";
import Settings from "@suid/icons-material/Settings";

import { showChangeGameModal } from "../modals/ChangeGameModal";
import { Button } from "./Buttons/Button";
import { DeployedCodeIcon, FirePatch } from "../assets/Icons";
import { GetGameName } from "../util";

let links = [
  { name: "Backup", href: "/backup", icon: SettingsBackupRestore },
  { name: "Downgrade", href: "/downgrade", icon: FastRewindSharp },
  { name: "Downloads", href: "/downloads", icon: DownloadRounded },
  { name: "Patch the game", href: "/patching", icon: FirePatch },
  {
    name: "Installed Mods",
    href: "/mods",
    icon: DeployedCodeIcon,
    noScroll: true,
  },
  { name: "Cosmetics & more", href: "/cosmetics", icon: Brush },
  // { name: "Get Mods & cosmetics", href: "/getMods", icon: SettingsBackupRestore },
  { name: "Tools & Options", href: "/tools", icon: Settings },
];

export default function Sidebar() {
  let appname = createMemo(() => {
    let currentApp = config()?.currentAppName;
    if (currentApp) return currentApp;
    currentApp = config()?.currentApp;
    if (currentApp) return currentApp;
    return "Not Selected";
  });

  return (
    <div class={styles.sidebar}>
      <div class={styles.header}>
        <div class={styles.logo}>
          Quest App <br /> Version Switcher
        </div>
        <div class={styles.currentApp}>
          <div title="Managed" class="inline packageName">
            {appname()} <FiEdit2 />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
          margin: "1rem 1rem 1rem 1rem",
        }}
      >
        <Button
          onClick={showChangeGameModal}
          fullWidth
          class={styles.changeAppButton}
        >
          Change app
        </Button>
      </div>

      <div class={styles["menuContainer"]}>
        <For each={links}>
          {(link) => (
            <A
              href={link.href}
              class={styles.menuItem}
              activeClass={styles.selected}
              noScroll={link.noScroll}
            >
              <link.icon></link.icon> <span>{link.name}</span>
            </A>
          )}
        </For>
        <Show when={config()?.currentApp === "com.beatgames.beatsaber"}>
          <A
            href="/bsmods"
            class={styles.menuItem}
            activeClass={styles.selected}
            noScroll={true}
          >
            <DeployedCodeIcon></DeployedCodeIcon> <span>Get Mods</span>
          </A>
        </Show>
      </div>
    </div>
  );
}
