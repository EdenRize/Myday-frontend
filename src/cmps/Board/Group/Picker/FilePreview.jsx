import { useRef } from "react"
import { resetDynamicModal, setDynamicModal } from "../../../../store/actions/system.actions"
import { useSelector } from "react-redux"
import { CloseIcon } from "../../../../services/svg.service"

export function FilePreview({ file, onUpdate, parentElementId, taskId }) {
    const previewBtnRef = useRef(null)

    const { parentId } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const isCurrPickerOpen = parentId === `${parentElementId}-filePicker`

    function onFilePreviewClick() {
        if (isCurrPickerOpen) {
            resetDynamicModal()
        } else {
            setDynamicModal({
                isOpen: true,
                parentRefCurrent: previewBtnRef.current,
                type: 'filePicker',
                data: {
                    file,
                    onChangeFile: onUpdate,
                    taskId
                },
                parentId: `${parentElementId}-filePicker`,
                isPosBlock: true,
            })
        }
    }

    function onRemoveFileClick(ev) {
        ev.stopPropagation()
        onUpdate('file', null)
    }

    return (
        <li ref={previewBtnRef} onClick={onFilePreviewClick}
            className="data-preview-container file-preview file-col"
        >
            <div className="data-preview-content flex align-center justify-center">
                {file && <img src={file} />}
            </div>

            {file && <button className="btn remove-btn" onClick={onRemoveFileClick}><CloseIcon /></button>}
        </li>
    )
}
