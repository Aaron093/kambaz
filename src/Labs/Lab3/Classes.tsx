import './Classes.css';
export default function Classes() {
    const color = 'red';
    return (
        <div>
        <h2>Classes</h2>
        <div className="wd-bg-yellow wd-fg-black wd-padding-10px">
            Yellow background  </div>
        <div className="wd-bg-blue wd-fg-black wd-padding-10px">
            Blue background    </div>
        <div className="wd-bg-red wd-fg-black wd-padding-10px">
            Red background     </div><hr/>

        <h2>Classes</h2>
        <div className={`wd-bg-${color} wd-fg-black wd-padding-10px`}>
        Dynamic Blue background
        </div>
        
        <h2>Classes</h2>
        <div className={`${true ? 'wd-bg-red' : 'wd-bg-green'}
                                     wd-fg-black wd-padding-10px`}>
       Dangerous background
        </div> ...
        </div>


    )
    };
