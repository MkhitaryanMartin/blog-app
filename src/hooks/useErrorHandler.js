import { message } from 'antd';

const useErrorHandler = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const errorHandle = (e) => {
        messageApi.open({
            type: 'error',
            content: e ? e : 'Add Name pls',
        });
    };

    return [errorHandle, contextHolder];
};

export default useErrorHandler;
