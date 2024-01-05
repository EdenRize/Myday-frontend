import { useState } from "react"

export function BoardEdit({ board }) {

    const [boardToEdit, setBoardToEdit] = useState(board)


    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break
            case 'checkbox':
                value = target.checked
                break
            default:
                break
        }
        setBoardToEdit(prevBoard => ({ ...prevBoard, [field]: value }))
    }

    async function onSaveBoard(ev) {
        ev.preventDefault()
        try {
            const savedBoard = await saveBoard(boardToEdit)
            // showSuccessMsg(`Board updated successfully ${savedBoard.name}`)
        } catch (err) {
            console.log('Cannot update board', err)
            // showErrorMsg('Cannot update board')
        }
    }

    // const { title, favorite, details } = boardToEdit


    return (
        <>
            <h3 className="title" title="Click to edit">{board.title}</h3>

            <div className="info-favorite flex align-center">
                <button className="btn info" title="Show board description">
                    <img src="../../public/icons/info.svg" alt="Info-icon" />
                </button>
                <button className="btn favorite" title="Add to favorites">
                    <img src="../../public/icons/favorite.svg" alt="Star-icon" />
                </button>
            </div>
        </>
    )
}
