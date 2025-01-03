export interface ILibrary {
  Provider: {
    FileExtension: string;
  };
  Id: string;
  Name: string;
  Author: string;
  Description: string;
  Version: {
    Major: number;
    Minor: number;
    Patch: number;
    PreRelease?: string;
    Build?: string;
    IsPreRelease: boolean;
  };
  VersionString: string;
  PackageVersion: string;
  Porter?: string;
  Robinson?: string;
  hasCover: boolean;
  IsInstalled: boolean;
  IsLibrary: true;
  FileCopyTypes: Array<any>;
}

export type IMod = ILibrary;

export interface IOperation {
  type: number;
  name: string;
}

export interface ModListResponse {
  mods: Array<IMod>;
  libs: Array<ILibrary>;
  operations: Array<IOperation>;
}

// This file is used to fetch data from the backend
export async function getModsList(): Promise<ModListResponse> {
  const response = await fetch("/api/mods/mods");
  return await response.json();
}

export async function UploadMod(file: File): Promise<boolean> {
  const response = await fetch(`/api/install?filename=${file.name}`, {
    method: "POST",
    body: file,
  });

  if (response.ok) {
    let json: {
      success: boolean;
      msg: string;
    } = await response.json();
    if (!json.success) {
      throw new Error(json.msg);
    }
    if (json.success) {
      return true;
    }
  }

  return false;
}

/**
 * Deletes a mod completely from quest
 * @param id
 * @returns
 */
export async function DeleteMod(id: string): Promise<boolean> {
  const response = await fetch(`/api/mods/delete?id=${id}`, { method: "POST" });
  if (response.ok) {
    let json: {
      success: boolean;
      msg: string;
    } = await response.json();
    if (!json.success) {
      throw new Error(json.msg);
    }
    if (json.success) {
      return true;
    }
  }
  return false;
}

/**
 * Disable or enable mods
 * @param id
 * @param enable
 */
export async function UpdateModState(id: string, enable: boolean) {
  await fetch(`/api/mods/${enable ? `enable` : `uninstall`}?id=${id}`, {
    method: "POST",
  });
}

/**
 * Deletes all mods for current game
 * @returns success
 */
export async function DeleteAllMods(): Promise<boolean> {
  let response = await fetch(`/api/mods/deleteallmods`, { method: "POST" });
  if (response.ok) {
    let json: {
      success: boolean;
      msg: string;
    } = await response.json();
    if (!json.success) {
      throw new Error(json.msg);
    }
    if (json.success) {
      return true;
    }
  }
  return false;
}

export async function InstallModFromUrl(url: string): Promise<boolean> {
  const response = await fetch(`/api/mods/installfromurl`, {
    method: "POST",
    body: url,
  });

  if (response.ok) {
    return true;
  }

  return false;
}

export enum QAVSModOperationType {
  ModInstall = 0,
  ModUninstall = 1,
  ModDisable = 2,
  ModDelete = 3,
  DependencyDownload = 4,
  Other = 5,
  Error = 6,
  ModDownload = 7,
  QueuedModInstall = 8,
}

export interface ModTask {
  operationId: number;
  name: string;
  type: QAVSModOperationType;
  isDone: boolean;
}

export async function getModOperations(): Promise<Array<ModTask>> {
  const response = await fetch("/api/mods/operations");
  return await response.json();
}

export async function deleteOperation(id: string) {
  const response = await fetch(`/api/mods/operation`, {
    method: "DELETE",
    body: id,
  });
  return await response.json();
}
