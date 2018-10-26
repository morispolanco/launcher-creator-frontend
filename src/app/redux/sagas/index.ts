import { all, select } from 'redux-saga/effects';
import authenticationSaga from './authenticationSaga';
import { createRequestInstance, RequestAction, watchRequests } from 'redux-saga-requests';

import mockDriver from './driver/MockDriver';
import axiosDriver from './driver/AxiosDriver';
import { AxiosRequestConfig } from 'axios';
import { getToken } from '../reducers/authenticationReducer';
import { put } from '../../../../node_modules/redux-saga/effects';
import { authenticationAction } from '../actions';
import wizardSaga from './wizardSaga';
import { isMockApi } from '../../api/ApiConfig';

const driver = isMockApi ? mockDriver : axiosDriver;
function* onRequest(request: AxiosRequestConfig, action: RequestAction) {
  yield put(authenticationAction.refreshToken());
  const token = yield select(getToken);
  request.headers = {
    ...request.headers,
    'Authorization': `Bearer ${token}`,
  };
  return request;
}


export default function* sagas() {
  yield createRequestInstance({ driver, onRequest });
  yield all([authenticationSaga(), wizardSaga(), watchRequests()]);
}