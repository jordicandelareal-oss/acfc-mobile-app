import React, { useState, useEffect } from 'react';
import { ShoppingCart, ShoppingBag, Utensils, RefreshCw, ChevronRight } from 'lucide-react';
import { fetchData, saveData } from './api';

function App() {
    const [activeTab, setActiveTab] = useState('compras');
    const [month, setMonth] = useState('Marzo');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab, month]);

    const loadData = async () => {
        setLoading(true);
        const action = activeTab === 'compras' ? 'shopping_list' : activeTab;
        const res = await fetchData(action, month);
        if (res.success) setData(res.items);
        setLoading(false);
    };

    const handleUpdate = async (item, colName, newValue) => {
        setSaveStatus('Guardando...');
        const colMap = { 'Precio': 3, 'ID_Mercadona': 15, 'quantity': 2 };
        const colIndex = colMap[colName];
        if (!colIndex) return;

        const res = await saveData(activeTab, item.row, { [colIndex]: newValue }, month);
        if (res.success) {
            setData(prev => prev.map(i => i.row === item.row ? { ...i, [colName]: newValue } : i));
            setSaveStatus('✅ Guardado');
            setTimeout(() => setSaveStatus(''), 2000);
        } else {
            setSaveStatus('❌ Error');
        }
    };

    return (
        <div className="app-container">
            <header className="header">
                <h1 className="header-title">ACFC Mobile</h1>
                <button onClick={loadData} className="tab-btn" style={{ width: 'auto', padding: '4px' }}>
                    <RefreshCw size={18} className={loading ? 'spin' : ''} />
                </button>
            </header>

            <nav className="tabs-nav">
                <button className={`tab-btn ${activeTab === 'menus' ? 'active' : ''}`} onClick={() => setActiveTab('menus')}>
                    <ShoppingCart size={18} /> Menús
                </button>
                <button className={`tab-btn ${activeTab === 'compras' ? 'active' : ''}`} onClick={() => setActiveTab('compras')}>
                    <ShoppingBag size={18} /> Compras
                </button>
                <button className={`tab-btn ${activeTab === 'insumos' ? 'active' : ''}`} onClick={() => setActiveTab('insumos')}>
                    <Utensils size={18} /> Insumos
                </button>
            </nav>

            <main className="content">
                {saveStatus && <div className="save-status">{saveStatus}</div>}

                {activeTab === 'menus' && (
                    <div className="premium-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Menú Semanal</h2>
                            <span className="badge badge-id">Semana {data[0]?.week || '?'}</span>
                        </div>
                        <div className="item-list">
                            {data.map((item, idx) => (
                                <div key={idx} className="item-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                                    <div style={{ fontWeight: 'bold', color: 'var(--primary)', width: '100%', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
                                        {item.Día}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <div className="item-info">
                                            <span className="item-meta">Almuerzo</span>
                                            <span className="item-name">{item.Almuerzo}</span>
                                        </div>
                                        <div className="item-info" style={{ alignItems: 'flex-end' }}>
                                            <span className="item-meta">Cena</span>
                                            <span className="item-name">{item.Cena}</span>
                                        </div>
                                    </div>
                                    {item.Guarnición && (
                                        <div className="item-meta" style={{ fontSize: '11px', fontStyle: 'italic' }}>
                                            + {item.Guarnición}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'compras' && (
                    <div className="premium-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Lista de Compras</h2>
                            <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '2px 8px' }}>
                                <option>Marzo</option><option>Abril</option><option>Mayo</option>
                            </select>
                        </div>
                        <div className="item-list">
                            {data.map((item, idx) => (
                                <div key={idx} className="item-row">
                                    <div className="item-info">
                                        <span className="item-name">{item.item || item.Nombre}</span>
                                        <span className="item-meta">{item.quantity} {item.unit}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="badge badge-id">{item.ID_Mercadona || 'Sin ID'}</span>
                                        <ChevronRight size={16} color="#cbd5e1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-primary" style={{ marginTop: '24px' }} onClick={() => alert("¡Listo! Ahora pídele a Antigravity: 'Sincroniza la lista de " + month + "' para actualizar tu carrito de Mercadona.")}>
                            <ShoppingCart size={20} /> Sincronizar Mercadona
                        </button>
                    </div>
                )}

                {activeTab === 'insumos' && (
                    <div className="premium-card">
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Precios e IDs</h2>
                        <div className="item-list">
                            {data.map((item, idx) => (
                                <div key={idx} className="item-row">
                                    <div className="item-info" style={{ maxWidth: '55%' }}>
                                        <span className="item-name">{item.Nombre}</span>
                                        <span className="item-meta">{item.Categoria}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            className="editable-input"
                                            defaultValue={item.Precio}
                                            onBlur={(e) => handleUpdate(item, 'Precio', e.target.value)}
                                            style={{ width: '50px' }}
                                        />
                                        <input
                                            type="text"
                                            className="editable-input"
                                            placeholder="ID"
                                            defaultValue={item.ID_Mercadona}
                                            onBlur={(e) => handleUpdate(item, 'ID_Mercadona', e.target.value)}
                                            style={{ width: '60px' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
