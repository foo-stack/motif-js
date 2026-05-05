import type { ReactNode } from 'react';

export interface ApiParam {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: ReactNode;
}

export interface ApiSignatureProps {
  name: string;
  signature: string;
  status?: 'stable' | 'beta';
  params?: ApiParam[];
}

export function ApiSignature({ name, signature, status, params }: ApiSignatureProps) {
  return (
    <div>
      <div className="api-head">
        <h1 className="api-head__name">{name}</h1>
        {status ? <span className={`api-head__tag api-head__tag--${status}`}>{status}</span> : null}
      </div>
      <pre className="api-sig">{signature}</pre>
      {params && params.length > 0 ? (
        <div className="params">
          {params.map((p) => (
            <div key={p.name} className="param">
              <div className="param__head">
                <span className="param__name">{p.name}</span>
                <span className="param__type">{p.type}</span>
                {p.required ? (
                  <span className="param__flag param__flag--required">required</span>
                ) : null}
                {p.default ? <span className="param__default">= {p.default}</span> : null}
              </div>
              <p className="param__desc">{p.description}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
