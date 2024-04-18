import { useEffect } from 'react';
import { message } from 'antd';

const useErrorHandler = () => {
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const errorHandle = (e) => {
            messageApi.open({
                type: 'error',
                content: e ? e : 'Add Name pls',
            });
        };

        return errorHandle;
    }, [messageApi]);

    return [contextHolder];
};

export default useErrorHandler;
