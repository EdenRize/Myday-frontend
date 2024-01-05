import { SidebarBoardLink } from "./SidebarBoardLink";

export function SidebarBoardNav({ boards, onToggleIsActive, isActive }) {
    return (
        <nav className="sidebar-board-nav">
            {boards.map(board => (
                <SidebarBoardLink
                    key={board._id}
                    board={board}
                    isActive={isActive}
                    onToggleIsActive={onToggleIsActive} />
            ))}
        </nav>
    )
}