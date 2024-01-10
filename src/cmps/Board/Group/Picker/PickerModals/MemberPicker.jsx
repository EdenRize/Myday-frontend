import { useEffect, useState } from "react"
import { CloseIcon, SearchIcon } from "../../../../../services/svg.service"
import { DynamicInput } from "../../../../DynamicInput"
import { UserImg } from "../../../../UserImg"

export function MemberPicker({ chosenMembers, allMembers, onChangeMembers }) {
    const [membersFilter, setMembersFilter] = useState('')
    const [currChosenMembers, setCurrChosenMembers] = useState(chosenMembers)
    const [currAllMembers, setCurrAllMembers] = useState(getFilterMembers(allMembers, chosenMembers))

    useEffect(() => {
        setCurrChosenMembers(chosenMembers)
        const filterMembers = getFilterMembers(allMembers, chosenMembers)
        setCurrAllMembers(filterMembers)
    }, [chosenMembers, allMembers])

    useEffect(() => {
        if (!membersFilter) {
            const filterMembers = getFilterMembers(allMembers, chosenMembers)
            setCurrAllMembers(filterMembers)
            return
        }
        filterMembers()

    }, [membersFilter])

    function getFilterMembers(allMembers, chosenMembers) {
        return allMembers.filter(member => (
            !chosenMembers.some(chosenMember => chosenMember._id === member._id)
        ))
    }

    function filterMembers() {
        const regex = new RegExp(membersFilter, 'i')
        const filteredAllMembers = getFilterMembers(allMembers, currChosenMembers)
            .filter(member => regex.test(member.fullname))

        setCurrAllMembers(filteredAllMembers)

    }

    function onAddMember(member) {
        const newChosenMembers = [member, ...currChosenMembers]

        setCurrChosenMembers(newChosenMembers)
        setCurrAllMembers(prevMembers => (
            prevMembers.filter(currMember => currMember._id !== member._id)
        ))
        onChangeMembers('members', newChosenMembers)
        setMembersFilter('')
    }

    function onRemoveMember(member) {
        const newChosenMembers = currChosenMembers.filter(currMember => currMember._id !== member._id)
        const newAllMembers = [member, ...currAllMembers]

        setCurrChosenMembers(newChosenMembers)
        setCurrAllMembers(getFilterMembers(newAllMembers, newChosenMembers))
        onChangeMembers('members', newChosenMembers)
        setMembersFilter('')
    }

    function onFilterMembers({ target }) {
        const searchVal = target.value
        setMembersFilter(searchVal)
    }

    const inputProps = {

        name: 'fullname',
        inputValue: membersFilter,
        placeholder: 'Search a name',
        handleChange: onFilterMembers,
        isSearchInput: false,
        additionalBtns: [
            {
                name: 'filter',
                icon: membersFilter ? <CloseIcon /> : < SearchIcon />,
                func: membersFilter ? () => setMembersFilter('') : () => { }
            }
        ]
    }

    return (
        <div className="general-modal member-picker-modal">

            <ul className="clean-list chosen-members-list">
                {currChosenMembers.map((member, idx) => {
                    return (
                        <li key={idx} className="chosen-member">
                            <UserImg user={member} />
                            <p className="username">{member.fullname}</p>
                            <button
                                className="remove-btn"
                                onClick={() => onRemoveMember(member)}>
                                X
                            </button>
                        </li>
                    )
                })}
            </ul>

            <div className="new-member-picker-container">
                <DynamicInput inputProps={inputProps} />

                {!membersFilter && <p className="suggested-people-title">Suggested people</p>}

                <ul className="clean-list member-options-list">
                    {currAllMembers.map((member, idx) => {
                        return (
                            <li key={idx}>
                                <button
                                    className="btn member-option"
                                    onClick={() => onAddMember(member)}
                                >
                                    <UserImg user={member} />
                                    <p className="username">{member.fullname}</p>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}
