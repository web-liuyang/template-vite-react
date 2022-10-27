/** 状态码 */
export enum STATUS_CODE {
  /** 成功 */
  SUCCESS = 200,
  /** 失败 - 用作提示 - 不操作 */
  FAIL_MESSAGE = 400,
  /** token 过期 */
  TOKEN_EXPIRED = 401,
}

/** 响应格式 */
export type Response<T = any> = {
  /** 状态码 */
  code: STATUS_CODE;
  /** 数据 */
  data: T;
  /** 消息 */
  msg: string;
};
