import os
import re

directory = 'e:/DA-BKS-THEO QD/backend/src'

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # fix local imports
            content = re.sub(r'(from\s+[\'"]\.[^\'"]*)(?<!\.js)([\'"])', r'\1.js\2', content)
            
            # fix Request/Response
            content = content.replace("import { Response, Request } from 'express';", "import type { Response, Request } from 'express';")
            
            # fix otplib
            content = content.replace("import { authenticator } from 'otplib';", "import * as otplib from 'otplib';\nconst { authenticator } = otplib;")
            
            # fix documents.service.ts
            content = content.replace("response.Metadata['iv']", "response.Metadata!['iv']")
            content = content.replace("response.Metadata['auth-tag']", "response.Metadata!['auth-tag']")
            content = content.replace("await response.Body.transformToByteArray()", "await (response.Body as any).transformToByteArray()")

            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
