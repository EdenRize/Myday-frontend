import { utilService } from "../../../services/util.service"

export function GroupTitlesList({ titles }) {
    return (
        <ul className="clean-list group-titles-list flex">
            {titles.map((title, idx) => {
                return <li key={idx} className={`${title}-col`}>
                    {utilService.capitalizeFirstLetter(title)}
                </li>
            })}
        </ul>
    )
}
