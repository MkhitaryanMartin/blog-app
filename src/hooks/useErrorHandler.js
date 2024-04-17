import { message } from 'antd';

const useErrorHandler = (e) => {
    const [messageApi, contextHolder] = message.useMessage();

    const errorHandle = (e) => {
        messageApi.open({
            type: 'error',
            content: e ? e : 'Please add title or text',
        });
    };

    return [errorHandle, contextHolder];
};

export default useErrorHandler;
