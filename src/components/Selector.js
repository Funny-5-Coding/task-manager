const Selector = ({ options, defaultValue, value, onChange }) => {
    return (
        <select
            value={value}
            onChange={event => onChange(event.target.value)}>
            <option
                disabled
                value={''}>
                {defaultValue}
            </option>
            {
                options.map(
                    (option, index) =>
                        <option
                            key={index}
                            value={option.value}>
                            {option.name}
                        </option>

                )
            }
        </select>
    )
}

export default Selector