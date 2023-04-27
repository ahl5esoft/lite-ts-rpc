import { ok, strictEqual } from 'assert';
import { Enum, EnumItem } from 'lite-ts-enum';
import { Mock } from 'lite-ts-mock';

import { RpcEnumLoadHandler as Self } from './enum-load-handler';
import { RpcBase } from './base';

class TestEnumItem extends EnumItem {
    public enumName: string;

    public static create(entry: EnumItem, enumName: string) {
        const item = new TestEnumItem();
        Object.assign(item, entry);
        item.enumName = enumName;
        return item;
    }
}

describe('src/enum-load-handler.ts', () => {
    describe('.handle(ctx: EnumLoadHandlerContext)', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const self = new Self(mockRpc.actual, (entry, enumName) => {
                return TestEnumItem.create(entry, enumName);
            });

            mockRpc.expectReturn(
                r => r.call({
                    body: {
                        areaNo: 11,
                        names: ['test-enum']
                    },
                    isThrow: true,
                    route: '/test-app/find-enum-items'
                }),
                {
                    data: {
                        'test-enum': [{
                            value: 1
                        }]
                    }
                }
            );

            const mockEnum = new Mock<Enum<EnumItem>>({
                name: 'test-enum'
            });
            const ctx = {
                areaNo: 11,
                app: 'test-app',
                enum: mockEnum.actual,
                res: null
            };
            await self.handle(ctx);
            ok(ctx.res[1] instanceof TestEnumItem);
            strictEqual(ctx.res[1].enumName, 'test-enum');
            strictEqual(ctx.res[1].value, 1);
        });
    });
});