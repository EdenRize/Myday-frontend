import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { ClockIcon, LikeIcon, PersonIcon, ReplyIcon } from "../../services/svg.service"
import { UserImg } from '../UserImg'
import loader from "/img/board-loader.gif"
import { boardService } from '../../services/board.service'
import { utilService } from '../../services/util.service'
import { SOCKET_EMIT_SEND_MSG, SOCKET_EMIT_SET_TOPIC, SOCKET_EVENT_ADD_MSG, socketService } from '../../services/socket.service'

export function PanelUpdate({ msgs, onAddUpdate }) {
    const { boardId, taskId } = useParams()

    const [users, setUsers] = useState([])
    const [updateTxt, setUpdateText] = useState('')
    const [currMsgs, setCurrMsgs] = useState(msgs)

    const inputRef = useRef(null)

    useEffect(() => {
        setCurrMsgs(msgs)
    }, [msgs])

    useEffect(() => {
        async function fetchUsers() {
            const userPromises = currMsgs.map(async (msg) => {
                const user = await getUser(msg.memberId)
                return user
            })

            const resolvedUsers = await Promise.all(userPromises)
            setTimeout(() => setUsers(resolvedUsers), 1000)
        }

        fetchUsers()
    }, [currMsgs])


    useEffect(() => {
        socketService.on(SOCKET_EVENT_ADD_MSG, addMsg) //listen to other people msgs
        return () => {
            socketService.off(SOCKET_EVENT_ADD_MSG, addMsg)
        }
    }, [])

    useEffect(() => {
        socketService.emit(SOCKET_EMIT_SET_TOPIC, taskId) //send topic change onmount and on topic change
    }, [taskId])

    function addMsg(newMsg) {
        console.log(newMsg)
        setCurrMsgs(prevMsgs => [newMsg, ...prevMsgs])
    }

    async function getUser(userId) {
        try {
            if (userId === undefined) return 'guest'
            const user = await userService.getById(userId)
            return user
        } catch (err) {
            console.error('error getting user', err)
            return null
        }
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        const newUpdate = boardService.getNewUpdate(updateTxt)
        socketService.emit(SOCKET_EMIT_SEND_MSG, newUpdate)
        onAddUpdate(newUpdate)

        setUpdateText('')
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    function toggleMenu(ev) {
        ev.stopPropagation()

        if (isMenuOpen) {
            resetDynamicModal()
        } else {
            setDynamicModal({
                isOpen: true,
                parentRefCurrent: menuBtnRef.current,
                parentId: `${boardId}-sidebar-menu`,
                type: 'menuOptions',
                data: { options: menuOptions },
                isPosBlock: true
            })
        }
    }

    function onLikeComment() {

    }

    const dynClass = inputRef.current?.value ? 'contains-txt' : ''

    if (currMsgs.length && users.length !== currMsgs.length) {
        return (
            <section className="loader-container panel-update flex align-center justify-center">
                <img className="myday-loader" src={loader} alt="" />
            </section>
        )
    }

    return (
        <section className="panel-update grid">
            <div className={`input-container ${dynClass}`}>
                <form onSubmit={handleSubmit} className="grid">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Write an update..."
                        onChange={(ev) => setUpdateText(ev.target.value)}
                    />

                    {inputRef.current?.value &&
                        <button type="submit" className="btn clrblue">
                            Update
                        </button>
                    }
                </form>
            </div>

            {currMsgs.length > 0 && users.length === currMsgs.length ? (
                currMsgs.map((msg, idx) => (
                    <article key={msg.id} className="update-post">
                        <section className="post-header flex align-center space-between">
                            <section className="post-creator grid column align-center">
                                {users[idx] !== 'guest' ? (
                                    <>
                                        <UserImg user={users[idx]} />
                                        {users[idx].fullname}
                                    </>
                                ) : (
                                    <>
                                        <PersonIcon />
                                        Guest
                                    </>
                                )}
                            </section>
                            <section className="post-time flex align-center justify-center">
                                <ClockIcon />
                                {utilService.timeSince(msg.createdAt)}
                                {/* <button
                                    className={`btn btn-option-menu`}
                                    alt="update Menu"
                                    onClick={toggleMenu}
                                    title="Update Menu"
                                    data-boardid={board._id}
                                    ref={menuBtnRef}
                                >
                                    <MenuIcon />
                                </button> */}
                            </section>
                        </section>
                        <section className="post-content">
                            <p>{msg.txt}</p>
                        </section>

                        <section className="likes-section flex">
                            {
                                msg.likes && msg.likes.length > 0 && (
                                    <article className="btn flex">
                                        👍 {msg.likes.length}
                                    </article>
                                )
                            }
                        </section>

                        <section className="post-actions flex align-center">
                            <div>
                                <button className="btn" onClick={onLikeComment}>
                                    <LikeIcon />Like
                                </button>
                            </div>
                            <div>
                                <button className="btn"><ReplyIcon />Reply</button>
                            </div>
                        </section>
                    </article>
                ))
            ) : (
                <div className="post_not_found grid place-center">
                    <img src="/icons/no-updates.svg" alt="" />
                    <div className="post-not-found-txt">
                        <h2>No Updates yet for this item</h2>
                        <p className="post_not_found_subtitle">Be the first one to update about progress, mention someone
                            <br />
                            or upload files to share with your team members</p>
                    </div>
                </div>
            )}
        </section>
    )
}
