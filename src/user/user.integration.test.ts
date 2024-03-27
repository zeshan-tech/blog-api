import { GET_ALL_PRODUCTS_BY_JOB_LOGS_ID, GET_STAGING_FAILED_PRODUCTS } from '../test/graphql/remediation-rules/queries';
import * as request from 'supertest';
import { TestServer } from '../test/test.server';
import { RemediationRulesModule } from './remediation-rules.module';
import { AuthModule } from '../auth/auth.module';
import { UPDATE_STAGING_FAILED_PRODUCTS } from '../test/graphql/remediation-rules/mutations';

describe('User test', () => {
  const server = new TestServer();
  let token: string;

  beforeAll(async () => {
    // setup test env
    await server.setup([RemediationRulesModule, AuthModule]);
    await server.insertIntoTable('table_metadata', tablemetadata);
    await server.insertIntoTable('data_template', datatemplate);
    await server.insertIntoTable('edi_mapping', edimapping);
    await server.insertIntoTable('company', company);
    await server.insertIntoTable('data_store', datastore);
    await server.insertIntoTable('data_flow', dataflow);
    await server.insertIntoTable('schedule', scedule);
    await server.insertIntoTable('job_batch', sceduleexecution);
    await server.insertIntoTable('job_logs', jobLogs);
    token = await server.tokenManager.getIdToken();
    token = `Bearer ${token}`;
    await server.signIn(token);
  }, 100000);

  afterAll(async () => {
    await server.close();
    await server.down();
  }, 100000);

  // describe('Test failed-products with errors', () => {
  const gql = '/graphql';

  it('should return failed-products with errors', () => {
    const req = request(server?.httpServer)
      .post(gql)
      .set({ Authorization: server?.authBody?.auth_token })
      .send({
        query: GET_STAGING_FAILED_PRODUCTS,
        variables: {
          input: {
            templateIds: [1, 2],
            errorStatus: ['pending'],
          },
          pagination: {
            offset: 0,
            limit: 100,
          },
        },
      });
    return req.expect(200).expect((res) => {
      expect(res.body.data.getAllFailedProducts).toHaveProperty('data'); // Check if the response has a data object
      expect(res.statusCode).toEqual(200); // Check if the response has a data object
    });
  }, 100000);

  it('sshould return staging-success-products or staging-failed-products by Job Logs Id', () => {
    const req = request(server?.httpServer)
      .post(gql)
      .set({ Authorization: server?.authBody?.auth_token })
      .send({
        query: GET_ALL_PRODUCTS_BY_JOB_LOGS_ID,
        variables: {
          pagination: { limit: 10, offset: 0 },
          params: {
            id: 1,
          },
          model: { entity: 'StagingSuccessProducts' },
        },
      });
    return req.expect(200).expect((res) => {
      expect(res?.statusCode).toBeDefined();
      expect(res.body.data.getAllProductsByJobLogsId).toHaveProperty('data');
      expect(res.body.data.getAllProductsByJobLogsId).toHaveProperty('totalRecords');
      expect(res.statusCode).toEqual(200);
    });
  }, 100000);

  it('should return updated-failed-product with errors', () => {
    const req = request(server?.httpServer)
      .post(gql)
      .set({ Authorization: server?.authBody?.auth_token })
      .send({
        query: UPDATE_STAGING_FAILED_PRODUCTS,
        variables: {
          param: {
            id: 1,
          },
          input: {
            stagingFailedProductFeed: 'lorem ipsum dolor sit amet, consectetur adipiscing',
          },
        },
      });
    return req.expect(200).expect((res) => {
      expect(res?.statusCode).toBeDefined();
      expect(res.statusCode).toEqual(200);
    });
  }, 100000);
  // });
});
