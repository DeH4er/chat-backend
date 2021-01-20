import {MigrationInterface, QueryRunner} from "typeorm";

export class ChannelsMessagesTables1611181224594 implements MigrationInterface {
    name = 'ChannelsMessagesTables1611181224594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, "channelId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel_users_user" ("channelId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_9c93687f86a4988a07a4d25aea6" PRIMARY KEY ("channelId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b1264bc94c62439e51a031b992" ON "channel_users_user" ("channelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_abc4f49166d336a1f2493dd6e1" ON "channel_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_users_user" ADD CONSTRAINT "FK_b1264bc94c62439e51a031b992b" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_users_user" ADD CONSTRAINT "FK_abc4f49166d336a1f2493dd6e1d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel_users_user" DROP CONSTRAINT "FK_abc4f49166d336a1f2493dd6e1d"`);
        await queryRunner.query(`ALTER TABLE "channel_users_user" DROP CONSTRAINT "FK_b1264bc94c62439e51a031b992b"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3"`);
        await queryRunner.query(`DROP INDEX "IDX_abc4f49166d336a1f2493dd6e1"`);
        await queryRunner.query(`DROP INDEX "IDX_b1264bc94c62439e51a031b992"`);
        await queryRunner.query(`DROP TABLE "channel_users_user"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
