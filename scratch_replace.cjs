const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'UserDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

const target1 = `{services.map(s => (
                          <option key={s._id} value={s._id}>{s.title} ({s.priceRange})</option>
                        ))}`;
const replacement1 = `{services.filter(svc => 
                          caregivers.some(cg => 
                            cg.isVerified && cg.specialties && cg.specialties.some((sp: string) => 
                              sp.toLowerCase().includes(svc.title.toLowerCase()) || svc.title.toLowerCase().includes(sp.toLowerCase())
                            )
                          )
                        ).map(s => (
                          <option key={s._id} value={s._id}>{s.title} ({s.priceRange})</option>
                        ))}`;

const target2 = `                            if (selectedService) {
                              const svc = services.find(s => s._id === selectedService);
                              if (svc && cg.specialties && cg.specialties.length > 0) {
                                 const matchesService = cg.specialties.some(sp => 
                                   sp.toLowerCase().includes(svc.title.toLowerCase()) || 
                                   svc.title.toLowerCase().includes(sp.toLowerCase())
                                 );
                                 if (!matchesService) return false;
                              }
                            }`;
const replacement2 = `                            if (selectedService) {
                              const svc = services.find(s => s._id === selectedService);
                              if (svc) {
                                 if (!cg.specialties || cg.specialties.length === 0) return false;
                                 const matchesService = cg.specialties.some((sp: string) => 
                                   sp.toLowerCase().includes(svc.title.toLowerCase()) || 
                                   svc.title.toLowerCase().includes(sp.toLowerCase())
                                 );
                                 if (!matchesService) return false;
                              }
                            } else {
                              return false;
                            }`;

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Replacements done');
