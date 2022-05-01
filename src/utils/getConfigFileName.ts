// 获取配置环境的文件名称
export const getConfigFileName = (env: Record<string, any>) => {
    return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || '__APP'}__CONF__`
        .toUpperCase()
        .replace(/\s/g, '');
}