import React from "react";
import {SHORTCUT_ROUTETAGS} from "../../redux/services/LetsGoService";
import {Radio, Spin} from "antd";

const Shortcuts = props => {
    const {selectedTag, loading, onTagChange} = props;
    return <Spin spinning={loading}>
        <Radio.Group
            onChange={e => {
                const tag = e.target.value;
                onTagChange(tag);
            }}
            value={selectedTag}
            optionType="button"
            buttonStyle="solid"
        >
            {SHORTCUT_ROUTETAGS.map(rTag => <Radio.Button value={rTag.tagName} key={rTag.id}>{rTag.nickName}</Radio.Button>)}
        </Radio.Group>
    </Spin>
}

export default Shortcuts;
