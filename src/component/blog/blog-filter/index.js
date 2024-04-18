import Input from "../../Input/input";
import "./style.css"

export default function BlogFilter({ onChange, value, onChangeRadio, valiuRadio, user }) {
    return (
        <div className='blog-filter'>
            <Input onChange={onChange} value={value} placeholder="Search blogs" />
            {user && <>
                <label>
                    <input
                        type="radio"
                        value="my"
                        checked={valiuRadio === 'my'}
                        onChange={() => onChangeRadio('my')}
                        className="filter-radio"
                    />
                    Show my blogs
                </label>
                <label>
                    <input
                        type="radio"
                        value="all"
                        checked={valiuRadio === null}
                        onChange={() => onChangeRadio(null)}
                        className="filter-radio"
                    />
                    Show all blogs
                </label>
            </>}
        </div>
    )
}