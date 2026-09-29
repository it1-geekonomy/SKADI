const AUTHORING_BASE = "https://apps.sarvam.ai/api/app-authoring";
const RUNTIME_BASE = "https://apps.sarvam.ai/api/app-runtime";

type SarvamEnv = {
  apiKey: string;
  orgId: string;
  workspaceId: string;
  appId: string;
  appName: string;
  agentVariables: Record<string, string>;
};

type NamedApp = {
  id: string;
  name: string;
};

let resolvedAppId: string | null = null;

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

export function getSarvamEnv(): SarvamEnv {
  const secretName = process.env.SARVAM_SECRET_NAME?.trim();
  const secretValue = process.env.SARVAM_SECRET_VALUE?.trim();
  const agentVariables: Record<string, string> = {};
  if (secretName && secretValue) {
    agentVariables[secretName] = secretValue;
  }

  return {
    apiKey: required("SARVAM_API_KEY"),
    orgId: required("SARVAM_ORG_ID"),
    workspaceId: required("SARVAM_WORKSPACE_ID"),
    appId: process.env.SARVAM_APP_ID?.trim() ?? "",
    appName: process.env.SARVAM_APP_NAME?.trim() || "SKadi",
    agentVariables,
  };
}

function collectApps(payload: unknown): NamedApp[] {
  const apps: NamedApp[] = [];

  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }

    const record = node as Record<string, unknown>;
    const appId = typeof record.app_id === "string" ? record.app_id.trim() : "";
    const name =
      (typeof record.name === "string" && record.name) ||
      (typeof record.app_name === "string" && record.app_name) ||
      "";

    if (appId) {
      apps.push({ id: appId, name });
    }

    for (const value of Object.values(record)) {
      if (value && typeof value === "object") visit(value);
    }
  };

  visit(payload);

  const unique = new Map<string, NamedApp>();
  for (const app of apps) {
    const existing = unique.get(app.id);
    if (!existing || (!existing.name && app.name)) {
      unique.set(app.id, app);
    }
  }
  return [...unique.values()];
}

function pickApp(apps: NamedApp[], appName: string): string | null {
  const wanted = appName.trim().toLowerCase();
  const exact = apps.find((app) => app.name.trim().toLowerCase() === wanted);
  if (exact) return exact.id;

  const partial = apps.find((app) => app.name.toLowerCase().includes("skadi"));
  if (partial) return partial.id;

  const ids = [...new Set(apps.map((app) => app.id))];
  if (ids.length === 1) return ids[0];
  return null;
}

async function sarvamGet(path: string, apiKey: string): Promise<unknown | null> {
  const response = await fetch(path, {
    headers: { "X-API-Key": apiKey },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return response.json();
}

export async function resolveSarvamAppId(): Promise<string> {
  const env = getSarvamEnv();
  if (env.appId) return env.appId;
  if (resolvedAppId) return resolvedAppId;

  const scope = `${AUTHORING_BASE}/v1/orgs/${env.orgId}/workspaces/${env.workspaceId}`;
  const payloads = await Promise.all([
    sarvamGet(`${scope}/deployments?limit=100`, env.apiKey),
    sarvamGet(
      `https://apps.sarvam.ai/api/scheduling/v1/orgs/${env.orgId}/workspaces/${env.workspaceId}/campaigns?limit=100`,
      env.apiKey
    ),
    sarvamGet(
      `https://apps.sarvam.ai/api/evals/v1/${env.orgId}/${env.workspaceId}/test-suites?limit=100`,
      env.apiKey
    ),
  ]);

  const appId = pickApp(
    payloads.flatMap((payload) => (payload ? collectApps(payload) : [])),
    env.appName
  );
  if (!appId) {
    throw new Error(
      "Sarvam agent was not found. Open the Skadi agent in Sarvam and set SARVAM_APP_ID to the app id from that page URL."
    );
  }

  resolvedAppId = appId;
  return appId;
}

export function sarvamRuntimeUrl(appId: string, search: string): string {
  const env = getSarvamEnv();
  const url = new URL(
    `${RUNTIME_BASE}/orgs/${env.orgId}/workspaces/${env.workspaceId}/apps/${appId}/url`
  );
  const params = new URLSearchParams(search);
  params.forEach((value, key) => {
    if (key === "interaction_type" || key === "version") {
      url.searchParams.set(key, value);
    }
  });
  if (!url.searchParams.get("interaction_type")) {
    url.searchParams.set("interaction_type", "call");
  }
  return url.toString();
}

export function isSarvamSignedUrlPath(path: string[], appId: string): boolean {
  const env = getSarvamEnv();
  const expected = ["orgs", env.orgId, "workspaces", env.workspaceId, "apps", appId, "url"];
  return path.length === expected.length && path.every((part, index) => part === expected[index]);
}
