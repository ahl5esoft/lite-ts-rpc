import { EnumItem, EnumLoadHandlerBase, EnumLoadHandlerContext } from 'lite-ts-enum';

import { RpcBase } from './base';

export class RpcEnumLoadHandler extends EnumLoadHandlerBase {
    public constructor(
        private m_Rpc: RpcBase,
        private m_BuildItemFunc: (entry: EnumItem, enumName: string) => EnumItem = entry => entry,
    ) {
        super();
    }

    public async handle(ctx: EnumLoadHandlerContext) {
        const res = await this.m_Rpc.call<{ [app: string]: EnumItem[]; }>({
            body: {
                areaNo: ctx.areaNo,
                names: [ctx.enum.name]
            },
            isThrow: true,
            route: `/${ctx.app}/find-enum-items`,
        });
        ctx.res = res.data[ctx.enum.name].reduce((memo, r) => {
            memo[r.value] = this.m_BuildItemFunc(r, ctx.enum.name);
            return memo;
        }, {});
    }
}