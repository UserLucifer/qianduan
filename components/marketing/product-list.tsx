import React from 'react';

const products = [
  { group: '> 80GB VRAM', items: [
    { name: 'H20 / 96GB', specs: '单精 暂无 / 半精 暂无' },
    { name: 'PRO 6000 / 96GB', specs: '单精 126.0 TFLOPS / 半精 503.8 Tensor TFLOPS' }
  ]},
  { group: '80GB VRAM', items: [
    { name: 'H800 / 80GB', specs: '单精 51.2 TFLOPS / 半精 756.0 Tensor TFLOPS' },
    { name: 'A800-80GB / 80GB', specs: '单精 19.5 TFLOPS / 半精 312 Tensor TFLOPS' }
  ]},
  { group: '48GB - 64GB VRAM', items: [
    { name: '华为 Ascend 910B2 / 64GB', specs: 'INT8 暂无 / FP16 暂无' },
    { name: 'NVIDIA L20 / 48GB', specs: '单精 59.35 TFLOPS / 半精 119.5 Tensor TFLOPS' },
    { name: '摩尔线程 MTT S4000 / 48GB', specs: 'INT8 暂无 / INT16 暂无' }
  ]},
  { group: '24GB - 32GB VRAM', items: [
    { name: 'NVIDIA RTX 5090 / 32GB', specs: '单精 104.8 TFLOPS / 半精 210 Tensor TFLOPS' },
    { name: 'NVIDIA V100 / 32GB', specs: '单精 15.7 TFLOPS / 半精 125 Tensor TFLOPS' },
    { name: 'NVIDIA RTX 4090 / 24GB', specs: '单精 82.58 TFLOPS / 半精 165.2 Tensor TFLOPS' },
    { name: 'NVIDIA RTX 3090 / 24GB', specs: '单精 35.58 TFLOPS / 半精 71 Tensor TFLOPS' }
  ]},
  { group: '≤ 16GB VRAM', items: [
    { name: 'NVIDIA RTX A4000 / 16GB', specs: '单精 19.17 TFLOPS / 半精 76.7 Tensor TFLOPS' },
    { name: 'NVIDIA RTX 3080Ti / 12GB', specs: '单精 34.10 TFLOPS / 半精 70 Tensor TFLOPS' },
    { name: 'NVIDIA RTX 3080 / 10GB', specs: '单精 29.77 TFLOPS / 半精 59.5 Tensor TFLOPS' },
    { name: 'NVIDIA RTX 2080Ti / 11GB', specs: '单精 13.45 TFLOPS / 半精 53.8 Tensor TFLOPS' }
  ]}
];

export default function ProductList() {
  return (
    <div className="product-table">
      <div className="product-table__header-row">
        <div className="product-table__col-name">GPU 型号</div>
        <div className="product-table__col-specs">算力规格</div>
        <div className="product-table__col-action"></div>
      </div>
      
      {products.map((group) => (
        <div key={group.group} className="product-group">
          <div className="product-group__header">{group.group}</div>
          <div className="product-group__list">
            {group.items.map((item) => (
              <div key={item.name} className="product-row">
                <div className="product-row__name">{item.name}</div>
                <div className="product-row__specs">{item.specs}</div>
                <div className="product-row__action">
                  <button className="pricing-btn" aria-label="查看详情">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
