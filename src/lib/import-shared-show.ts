import {
  clearShareParamFromLocation,
  computeShareKey,
  decodeShowShareParam,
  readShareParamFromLocation,
} from '@/lib/show-share';
import { useAppStore } from '@/store/useAppStore';

export type ImportSharedShowError = 'invalid' | 'full';

export type ShareImportResult =
  | { kind: 'none' }
  | { kind: 'error'; error: ImportSharedShowError }
  | { kind: 'success'; outcome: 'imported' | 'existing' };

/** Read `?show=`, import into the workspace, and strip the param from the URL. */
export function processShareImportFromLocation(): ShareImportResult {
  const param = readShareParamFromLocation();
  if (!param) return { kind: 'none' };

  clearShareParamFromLocation();

  const payload = decodeShowShareParam(param);
  if (!payload) {
    return { kind: 'error', error: 'invalid' };
  }

  const outcome = useAppStore
    .getState()
    .importSharedShow(payload, computeShareKey(payload));

  if (outcome === 'full') {
    return { kind: 'error', error: 'full' };
  }

  return { kind: 'success', outcome };
}
