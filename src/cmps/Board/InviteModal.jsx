import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
// import { getUsers } from "../../store/actions/user.actions"
import { MemberList } from "../MemberList"
import { CloseIcon, SearchIcon } from "../../services/svg.service"
import { useEffectUpdate } from "../../customHooks/useEffectUpdate"
import { DynamicInput } from "../DynamicInput"
import { updateBoard } from "../../store/actions/board.actions"
import { showErrorMsg, showSuccessMsg } from "../../store/actions/system.actions"

export function InviteModal({ board, onCloseDialog }) {
    var users = useSelector(storeState => storeState.userModule.users)

    // const [users, setUsers] = useState(null)
    const [filteredUsers, setFilteredUsers] = useState(null)
    const [usersFilter, setUsersFilter] = useState('')
    const boardMembers = board.members

    useEffect(() => {

        const usersToShow = getUsersToShow(users)
        setFilteredUsers(usersToShow || [])

        // const fetchData = async () => {
        //     try {
        //         const usersFromDb = await getUsers()
        //         setUsers(usersFromDb || [])

        //         const usersToShow = getUsersToShow(usersFromDb)
        //         setFilteredUsers(usersToShow || [])
        //     } catch (error) {
        //         console.error("Error fetching data:", error)
        //     }
        // }

        // fetchData()

    }, [boardMembers])

    useEffectUpdate(() => {
        if (!usersFilter) {
            const usersToShow = getUsersToShow(users)
            setFilteredUsers(usersToShow || [])
            return
        }
        filterUsers()

    }, [usersFilter])

    function getUsersToShow(users) {
        return users.filter(user => !boardMembers.some(member => member._id === user._id))
    }

    function onFilterUsers({ target }) {
        const searchVal = target.value
        setUsersFilter(searchVal)
    }

    function filterUsers() {
        const regex = new RegExp(usersFilter, 'i')
        const newFilteredUsers = users.filter(user => regex.test(user.fullname))

        setFilteredUsers(newFilteredUsers)
    }

    async function onUserSelect(user) {
        try {
            const newBoard = { ...board, members: [...board.members, user] }
            await updateBoard(newBoard)
            showSuccessMsg(`user ${user.fullname} was added to ${board.title} board!`)
        } catch (err) {
            console.log('err', err)
            showErrorMsg('Cannot add user to board')
        }
    }

    const inputProps = {

        name: 'fullname',
        inputValue: usersFilter,
        placeholder: 'Search a name',
        handleChange: onFilterUsers,
        isSearchInput: false,
        additionalBtns: [
            {
                name: 'filter',
                icon: usersFilter ? <CloseIcon /> : < SearchIcon />,
                func: usersFilter ? () => setUsersFilter('') : () => { }
            }
        ]
    }

    if (!filteredUsers) return <div className="invite-modal">Loading...</div>
    return (
        <div className="invite-modal">
            <div className="sticky-container">
                <span>Invite Users</span>
                <DynamicInput inputProps={inputProps} />
                <button className="btn close-btn" onClick={onCloseDialog}><CloseIcon /></button>
            </div>
            <MemberList members={filteredUsers} onMemberClick={onUserSelect} />

        </div>
    )
}
