import { useSelector } from "react-redux"

import { ColorPicker } from "./Board/Group/Picker/PickerModals/ColorPicker"
import { MemberPicker } from "./Board/Group/Picker/PickerModals/MemberPicker"
import { StatusPicker } from "./Board/Group/Picker/PickerModals/StatusPicker"
import { DatePicker } from "./Board/Group/Picker/PickerModals/DatePicker"
import { LinkPicker } from "./Board/Group/Picker/PickerModals/LinkPicker"
import { MenuOptionsModal } from "./MenuOptionsModal"
import BoardMemberSelect from "./Board/BoardMemberSelect"

export function DynamicAbsoluteModal() {
    const modalData = useSelector((storeState) => storeState.systemModule.dynamicModal)

    if (!modalData.isOpen) return

    const isPosBlock = modalData.isPosBlock ? true : false

    let style = {
        //centered below father:
        // top: `${modalData.boundingRect.bottom}px`,
        // left: `${modalData.boundingRect.left + (modalData.boundingRect.width / 2) - (modalWidth / 2)}px` 
    }

    if (isPosBlock) { // top/bottom relative to the clicked father
        style = {
            top: `${modalData.boundingRect.bottom}px`, // directly below father
            left: `${modalData.boundingRect.right - modalData.boundingRect.width}px` // the left of the modal will be the left of the father
        }
    } else { // left/right relative to the clicked father
        style = {
            top: `${modalData.boundingRect.top}px`, // Aligns the top of the modal with the top of the father
            left: `${modalData.boundingRect.right}px`,
        }
    }

    return (
        <div style={style || {}} className="dynamic-absolute-modal">
            <DynamicModal type={modalData.type} data={modalData.data} />
        </div>
    )
}

function DynamicModal(props) {
    switch (props.type) {
        case 'colorPicker':
            return (
                <ColorPicker
                    colors={props.data.colors}
                    onColorClick={props.data.onColorClick}
                />)

        case 'datePicker':
            return (
                <DatePicker
                    selectedDate={props.data.selectedDate}
                    onChangeDate={props.data.onChangeDate}
                />)

        case 'statusPicker':
            return (
                <StatusPicker
                    selectedStatus={props.data.selectedStatus}
                    title={props.data.title}
                    onChangeStatus={props.data.onUpdate}
                />)

        case 'linkPicker':
            return (
                <LinkPicker
                    url={props.data.url}
                    displayTxt={props.data.displayTxt}
                    changeLink={props.data.onChangeLink}
                />)

        case 'memberPicker':
            return (
                <MemberPicker
                    chosenMembers={props.data.chosenMembers}
                    memberOptions={props.data.memberOptions}
                    onChangeMembers={props.data.onChangeMembers}
                />)

        case 'menuOptions':
            return <MenuOptionsModal options={props.data.options} />

        case 'boardMemberSelect':
            return <BoardMemberSelect chosenMember={props.data.chosenMember} members={props.data.members} onChangeMember={props.data.onChangeMember} />
    }
}