import { SidebarFilter } from "./SidebarFilter";
import { SidebarWorkspaceNav } from "./SidebarWorkspaceNav";

export function SidebarWorkspace(
    { onToggleDropdown, onToggleIsFocus, isDropdownOpen, isFocus, onAddNewBoard }
) {
    return (
        <section className="sidebar-workspace">
            <SidebarWorkspaceNav
                onToggleDropdown={onToggleDropdown}
                isDropdownOpen={isDropdownOpen}
            />
            <SidebarFilter
                onToggleIsFocus={onToggleIsFocus}
                isFocus={isFocus}
                onAddNewBoard={onAddNewBoard}
            />
        </section>
    )
}