const fs = require("fs");
const path = require("path");
const p = path.join(__dirname, "src", "pages", "dashboard", "UserDashboard.tsx");
let content = fs.readFileSync(p, "utf-8");

const target = `{services.filter(svc => 
                          caregivers.some(cg => 
                            cg.isVerified && cg.specialties && cg.specialties.some((sp: string) => 
                              sp.toLowerCase().includes(svc.title.toLowerCase()) || svc.title.toLowerCase().includes(sp.toLowerCase())
                            )
                          )
                        ).map((s: any) => (
                          <option key={s._id} value={s._id}>{s.title} ({s.priceRange})</option>
                        ))}`;

const replacement = `{services.filter(svc => 
                          caregivers.some(cg => 
                            cg.isVerified && cg.specialties && cg.specialties.some((sp: string) => 
                              sp.toLowerCase().includes(svc.title.toLowerCase()) || svc.title.toLowerCase().includes(sp.toLowerCase())
                            )
                          )
                        ).map((s: any) => {
                          const matchingCg = caregivers.filter((cg: any) => cg.isVerified && cg.specialties && cg.specialties.some((sp: string) => sp.toLowerCase().includes(s.title.toLowerCase()) || s.title.toLowerCase().includes(sp.toLowerCase())));
                          const minRate = matchingCg.length > 0 ? Math.min(...matchingCg.map((c: any) => c.hourlyRate || 999)) : null;
                          const priceLabel = minRate ? \`From $\${minRate}/hr\` : s.priceRange;
                          return (
                            <option key={s._id} value={s._id}>{s.title} ({priceLabel})</option>
                          );
                        })}`;

content = content.replace(target, replacement);
fs.writeFileSync(p, content, "utf-8");
console.log("Done");
